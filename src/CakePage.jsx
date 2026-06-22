import { useEffect, useState } from "react";
import "./CakePage.css";
import { supabase } from "./supabase";

import background from "./assets/background.svg";
import logo from "./assets/logo2.svg";
import shareButton from "./assets/share-button.svg";
import reviewsButton from "./assets/reviews-button.svg";
import sendButton from "./assets/send-button.svg";
import popup1 from "./assets/popup1.svg";

import cake1 from "./assets/cake1.jpg";
import cake2 from "./assets/cake2.jpg";
import cake3 from "./assets/cake3.jpg";
import cake4 from "./assets/cake4.jpg";

import berryBlissTitle from "./assets/berry-bliss-title.svg";
import berryPistachioTitle from "./assets/berry-pistachio-title.svg";
import caramelPecanTitle from "./assets/caramel-pecan-title.svg";
import honeyPistachioTitle from "./assets/honey-pistachio-title.svg";

const N8N_WEBHOOK_URL =
  "https://indicators-gis-msie-companies.trycloudflare.com/webhook/new-review";

function CakePage() {
  const [showWritePopup, setShowWritePopup] = useState(false);
  const [showReviewsPopup, setShowReviewsPopup] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([[], [], [], []]);

  const cakes = [cake1, cake2, cake3, cake4];

  const cakeNames = [
    "Berry Bliss Cake",
    "Berry Pistachio Cake",
    "Caramel Pecan Cake",
    "Honey Pistachio Cake",
  ];

  const cakeTitleImages = [
    berryBlissTitle,
    berryPistachioTitle,
    caramelPecanTitle,
    honeyPistachioTitle,
  ];

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const grouped = [[], [], [], []];

    data.forEach((item) => {
      const index = item.cake_id - 1;
      if (grouped[index]) {
        grouped[index].push(item.review);
      }
    });

    setReviews(grouped);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openWritePopup = (index) => {
    setSelectedCake(index);
    setReviewText("");
    setShowWritePopup(true);
  };

  const openReviewsPopup = (index) => {
    setSelectedCake(index);
    setShowReviewsPopup(true);
  };

  const sendReview = async () => {
    const cleanReview = reviewText.trim();

    if (!cleanReview || selectedCake === null) return;

    const newReview = {
      cake_id: selectedCake + 1,
      cake_name: cakeNames[selectedCake],
      review: cleanReview,
      sentiment: "pending",
    };

    const { error } = await supabase.from("reviews").insert([newReview]);

    if (error) {
      console.error(error);
      alert("Review was not sent.");
      return;
    }

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
    } catch (n8nError) {
      console.error("n8n webhook error:", n8nError);
    }

    setShowWritePopup(false);
    setReviewText("");
    fetchReviews();
  };

  return (
    <main className="cake-page">
      <img className="cake-bg" src={background} alt="" />
      <img className="cake-logo" src={logo} alt="AMORIA" />

      <section className="cakes-grid">
        {cakes.map((cake, index) => (
          <div className="cake-card" key={index}>
            <img
              className="cake-title-img"
              src={cakeTitleImages[index]}
              alt={cakeNames[index]}
            />

            <img className="cake-img" src={cake} alt={cakeNames[index]} />

            <button className="share-btn" onClick={() => openWritePopup(index)}>
              <img src={shareButton} alt="Share your thoughts" />
            </button>

            <button
              className="reviews-btn"
              onClick={() => openReviewsPopup(index)}
            >
              <img src={reviewsButton} alt="View all reviews" />
            </button>
          </div>
        ))}
      </section>

      {showWritePopup && (
        <div className="popup-overlay" onClick={() => setShowWritePopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <img className="popup-bg" src={popup1} alt="" />

            <textarea
              className="review-input"
              placeholder="Write your thoughts..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <button className="send-btn" onClick={sendReview}>
              <img src={sendButton} alt="Send" />
            </button>
          </div>
        </div>
      )}

      {showReviewsPopup && (
        <div
          className="popup-overlay"
          onClick={() => setShowReviewsPopup(false)}
        >
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <img className="popup-bg" src={popup1} alt="" />

            <div className="reviews-list">
              {reviews[selectedCake]?.length > 0 ? (
                reviews[selectedCake].map((review, index) => (
                  <p key={index}>“{review}”</p>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CakePage;