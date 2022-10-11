import React, { useState, useEffect, useCallback, useRef } from "react";
import update from "immutability-helper";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authContext";
import MkdSDK from "../utils/MkdSDK";
import VideoTile from "../components/VideoTile";

const AdminDashboardPage = () => {

  const { dispatch } = React.useContext(AuthContext);
  const navigate = useNavigate();

  let sdk = new MkdSDK();

  const [videoData, setVideoData] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const numberOfPages = useRef(0);

  const getData = async (page) => {
    const payload = {
      payload: {},
      page: page,
      limit: 10,
    };
    const method = "PAGINATE";
    const data = await sdk.callRestAPI(payload, method);
    numberOfPages.current = data.num_pages;
    !data.error && setVideoData(data.list);
  };

  useEffect(() => {
    getData(pageNum);
  }, [pageNum]);

  // Update the order of the draggable cards
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setVideoData((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);
  // Render each card
  const renderCard = useCallback((videoData, index) => {
    return (
      <VideoTile
        key={videoData.id}
        index={index}
        id={videoData.id}
        imgSrc={videoData.photo}
        title={videoData.title}
        avatarSrc={videoData.photo}
        username={videoData.username}
        likes={videoData.like}
        moveCard={moveCard}
      />
    );
  }, []);

  const logout = () => {
    dispatch({ type: "LOGOUT"});
    navigate("/admin/login");
  };

  return (
    <>
      <div className="container w-full h-full text-7xl h-screen text-gray-700 ">
        <div className=" w-full align-start bg-black px-16 pt-8 pb-8">
          <div className="w-full flex justify-between">
            <h2 className="text-3xl text-white font-bold">APP</h2>
            <button onClick={logout} className="bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-2 px-4 rounded-full">
              Logout
            </button>
          </div>
          <div className="flex justify-between py-4">
            <div className="font-sm text-white text-2xl">
              Today's leaderboard
            </div>
            <div className="flex space-x-3 text-sm text-white bg-gray-800 rounded-full py-2 px-6">
              <span >
                11 Oct 2022
              </span>
              <span className="bg-green-600 rounded-full px-2">
                Submission Open
              </span>
              <span>
                5:58
              </span>
            </div>
          </div>
          {videoData?.map((videoData, index) => renderCard(videoData, index))}

          <div className="flex justify-center space-x-5">
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-2 px-6 rounded-full"
              onClick={() => setPageNum((prev) => (prev === 1 ? 1 : prev - 1))}
            >
              Prev
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-2 px-6 rounded-full"
              onClick={() => setPageNum((prev) => (prev === numberOfPages.current ? numberOfPages.current : prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
