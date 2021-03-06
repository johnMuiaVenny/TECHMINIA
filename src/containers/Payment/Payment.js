import React, { useEffect, useState } from "react";
import Button from "components/Button/Button";
import RadioCard from "components/RadioCard/RadioCard";
import RadioGroup from "components/RadioGroup/RadioGroup";
import UpdateContact from "./Update/UpdateContact";
import { openModal } from "@redq/reuse-modal";
import {
  PaymentContainer,
  Heading,
  ButtonGroup,
  Contact,
} from "./Payment.style";

// import { ProfileContext } from "contexts/profile/profile.context";
import { axiosInstance, tokenConfig } from "utils/axios";
import { useAlert } from "react-alert";

// The type of props Payment Form receives

const Payment = ({ setSelectedContact }) => {
  // const { dispatch } = useContext(ProfileContext);
  const [contact, setContact] = useState([]);
  const [fetch, makeFetch] = useState(false);
  const alert = useAlert();
  useEffect(() => {
    axiosInstance.get(`/account/contact/`, tokenConfig()).then((res) => {
      setContact(res.data.results);
      fetchNew(false);
    });
  }, [fetch]);
  const fetchNew = (bool) => {
    makeFetch(bool);
  };

  // Add or edit modal
  const handleModal = (
    modalComponent,
    modalProps = {},
    className = "add-address-modal"
  ) => {
    openModal({
      show: true,
      overlayClassName: "quick-view-overlay",
      closeOnClickOutside: true,
      component: modalComponent,
      componentProps: { item: modalProps, fetchNew },
      closeComponent: "",
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "quick-view-modal",
        width: 458,
        height: "auto",
      },
    });
  };

  const handleEditDelete = async (item, type, name) => {
    if (type === "edit") {
      handleModal(UpdateContact, item);
    } else {
      // dispatch({ type: "DELETE_CONTACT", payload: item.id });

      return await axiosInstance
        .patch(
          `/account/contact/${item.id}/`,
          { is_deleted: true },
          tokenConfig()
        )
        .then((res) => {
          fetchNew(true);
          alert.info(`${res.data.contact} contact deleted`);
        });
    }
  };

  return (
    <form>
      <PaymentContainer>
        {/* Contact number */}
        <Contact>
          <Heading>Select Your Contact Number</Heading>
          <ButtonGroup>
            <RadioGroup
              items={contact}
              component={(item, i) => (
                <RadioCard
                  id={item.id}
                  key={i}
                  title={item.name}
                  content={item.contact}
                  checked={item.type === "primary"}
                  onChange={() => {
                    // dispatch({
                    //   type: "SET_PRIMARY_CONTACT",
                    //   payload: item.id,
                    // });
                    setSelectedContact(item);
                  }}
                  name="contact"
                  onEdit={() => handleEditDelete(item, "edit", "contact")}
                  onDelete={() => handleEditDelete(item, "delete", "contact")}
                />
              )}
              secondaryComponent={
                <Button
                  title="Add Contact"
                  iconPosition="right"
                  colors="primary"
                  style={{ color: "#fff" }}
                  size="small"
                  variant="outlined"
                  type="button"
                  intlButtonId="addContactBtn"
                  onClick={() =>
                    handleModal(UpdateContact, "add-contact-modal")
                  }
                />
              }
            />
          </ButtonGroup>
        </Contact>
      </PaymentContainer>
    </form>
  );
};

export default Payment;
