import React, { useContext, useState } from "react";
import {
  Col2,
  Container,
  CourseTitle,
  Instructor,
  MGrid,
  Video,
  VideoPreview,
  VideoText,
  WatchButton,
  Wrapper,
} from "./VideoCarousel.style";
import { AreaHeading } from "./LandingPage.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Carousel from "components/Carousel/Carousel";
import Fade from "react-reveal/Fade";
import VideoCast from "components/Video/Video";
import tuit from "images/tuit.png";
import { useHistory } from "react-router-dom";
import { AuthContext } from "contexts/auth/auth.context";
import { logToConsole } from "utils/logging";

// const videos = [
//   {
//     id: 1,
//     title: "Role of DNA in protein synthesis",
//     class: "Biology Form Four",
//     teachers: "Mr. Kamau, Mr. Omondi",
//     rating: 5,
//     minRating: 0,
//     maxRating: 10,
//     starRatio: 2,
//     hardLimit: 10,
//     tally: "26,014",
//     placeholder: tuit,
//     video_url: "http://127.0.0.1:8000/media/videos/burna.mp4",
//   },
//   {
//     id: 2,
//     title: "Role of DNA in protein synthesis",
//     class: "Biology Form Four",
//     teachers: "Mr. Kamau, Mr. Omondi",
//     rating: 5,
//     minRating: 0,
//     maxRating: 10,
//     starRatio: 2,
//     hardLimit: 10,
//     tally: "26,014",
//     placeholder: tuit,
//     video_url: "http://127.0.0.1:8000/media/videos/burna.mp4",
//   },
//   {
//     id: 3,
//     title: "Role of DNA in protein synthesis",
//     class: "Biology Form Four",
//     teachers: "Mr. Kamau, Mr. Omondi",
//     rating: 5,
//     minRating: 0,
//     maxRating: 10,
//     starRatio: 2,
//     hardLimit: 10,
//     tally: "26,014",
//     placeholder: tuit,
//     video_url: "http://127.0.0.1:8000/media/videos/burna.mp4",
//   },
//   {
//     id: 4,
//     title: "Role of DNA in protein synthesis",
//     class: "Biology Form Four",
//     teachers: "Mr. Kamau, Mr. Omondi",
//     rating: 5,
//     minRating: 0,
//     maxRating: 10,
//     starRatio: 2,
//     hardLimit: 10,
//     tally: "26,014",
//     placeholder: tuit,
//     video_url: "http://127.0.0.1:8000/media/videos/burna.mp4",
//   },
//   {
//     id: 5,
//     title: "Role of DNA in protein synthesis",
//     class: "Biology Form Four",
//     teachers: "Mr. Kamau, Mr. Omondi",
//     rating: 5,
//     minRating: 0,
//     maxRating: 10,
//     starRatio: 2,
//     hardLimit: 10,
//     tally: "26,014",
//     placeholder: tuit,
//     video_url: "http://127.0.0.1:8000/media/videos/burna.mp4",
//   },
// ];

const sampleVideos = [
  {
    title: "Pressure",
    class: "Form One Physics",
    video_url: "https://youtu.be/51Frb55m66Y",
    placeholder: tuit,
  },
  {
    title: "States Of Matter",
    class: "Form One Chemistry",
    video_url: "https://www.youtu.be/apF2rfFnUqY",
    placeholder: tuit,
  },
  {
    title: "Symbiosis",
    class: "Form Three Biology",
    video_url: "https://youtu.be/j-wXKjpIr1w",
    placeholder: tuit,
  },
  {
    title: "Pyramid of Numbers",
    class: "Form Three Biology",
    video_url: "https://youtu.be/Zj9SgGIJk-U",
    placeholder: tuit,
  },
  {
    title: "Ecology",
    class: "Form Three Biology",
    video_url: "https://youtu.be/NTuLYXQMnQE",
    placeholder: tuit,
  },
];
function VideoCarousel({ deviceType }) {
  const history = useHistory();
  const {
    authState: { isAuthenticated },
    authDispatch,
  } = useContext(AuthContext);
  const [selectedVideo, setSelectedVideo] = useState(false);
  logToConsole(selectedVideo);
  const selectVideo = (v) => {
    if (selectedVideo === false) {
      setSelectedVideo(v);
      // handleModal();
    } else {
      if (selectedVideo === true) {
        if (isAuthenticated) {
          history.push(`/dashboard`);
        } else {
          authDispatch({
            type: "SIGNIN",
          });
        }
      }
      setSelectedVideo(true);
    }
  };
  return (
    <Container>
      <AreaHeading>
        <h3>Popular Classes</h3>
      </AreaHeading>
      <Wrapper>
        <Carousel
          deviceType={deviceType}
          autoPlay={false}
          infinite={true}
          data={sampleVideos}
          component={(video, idx) => (
            <Fade key={idx} bottom duration={800} delay={idx * 100}>
              <Video onClick={() => selectVideo(video)}>
                <VideoPreview>
                  <VideoCast url={video.video_url} playercontrols={false} />
                </VideoPreview>
                <VideoText>
                  <CourseTitle>{video.title}</CourseTitle>
                  <Instructor>{video.class}</Instructor>

                  <MGrid className="action-row">
                    <Col2>
                      {/* <WatchButton>
                        <h3>
                          <FontAwesomeIcon icon={"play-circle"} /> WATCH VIDEO
                        </h3>
                      </WatchButton> */}
                    </Col2>
                  </MGrid>
                </VideoText>
              </Video>
            </Fade>
          )}
        />
      </Wrapper>
    </Container>
  );
}

export default VideoCarousel;
