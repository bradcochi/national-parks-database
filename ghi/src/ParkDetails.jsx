import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetReviewsByParkQuery,
  useGetAccountQuery,
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useGetVisitedQuery,
} from "./app/apiSlice";
import ReviewForm from "./ReviewForm";

const ParkDetails = () => {
  const { data: account } = useGetAccountQuery();
  const { data: wishlist } = useGetWishlistQuery();
  const { data: visited } = useGetVisitedQuery();
  const [addToWishlist] = useAddToWishlistMutation();

  let { parkCode } = useParams();

  const [park, setPark] = useState();
  const { data, isLoading } = useGetReviewsByParkQuery(parkCode);
  const fetchData = async () => {
    const url = `http://localhost:8000/api/parks/code/${parkCode}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setPark(data.data[0]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let fullName = park?.fullName;
  let states = park?.states;

  let reviewed = false;
  if (data && account) {
    for (let entry of data) {
      if (entry.account_id == account.id) {
        reviewed = true;
      }
    }
  }
  let wishlisted = false;
  if (wishlist && visited && account) {
    for (let entry of wishlist) {
      if (entry.fullName == park?.fullName) {
        wishlisted = true;
      }
    }
    for (let entry of visited) {
      if (entry.fullName == park?.fullName) {
        wishlisted = true;
      }
    }
  }
  console.log(park);

  let parkProps = {
    parkCode: parkCode,
    parkName: park?.fullName,
  };

  if (!park) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div
          id="detail-page-header"
          style={{ backgroundImage: `url(${park.images[0].url})` }}
        >
          <h2>{park.fullName}</h2>
        </div>
        {!wishlisted && account && (
          <button
            className="btn btn-primary"
            onClick={() => addToWishlist({ parkCode, fullName, states })}
          >
            Add to Wishlist
          </button>
        )}
        {wishlisted && account && (
          <button disabled={true} className="btn btn-success">
            Added
          </button>
        )}
        <div>{park.description}</div>
        {park.images.length > 0 && (
          <img src={park.images[1].url} alt={park.fullName} />
        )}
        <div>
          <table>
            <tbody>
              {park.activities.map((activity) => {
                return (
                  <tr key={activity.id}>
                    <td>{activity.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Reviews</h2>
          <table>
            <tbody>
              {data.map((review) => {
                return (
                  <tr key={review.id}>
                    <td>{review.rating}</td>
                    <td>{review.review}</td>
                    <td>{review.username}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Leave a Review
      </button>

      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Leave a Review
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div>
                {account && !reviewed && (
                  <ReviewForm parkProps={parkProps}></ReviewForm>
                )}
                {reviewed && (
                  <p>
                    You've reviewed this park! If you'd like to edit your review
                    please visit your MyReviews page.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParkDetails;
