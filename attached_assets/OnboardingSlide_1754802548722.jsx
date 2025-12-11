import React from "react";

const OnboardingSlide = ({ title, description, image, isLast, onNext, onSkip }) => {
  return (
    <div className="onboarding-slide glass">
      <div className="slide-icon">{image}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="onboarding-buttons">
        {onSkip && <button className="skip-btn" onClick={onSkip}>Skip</button>}
        <button className="next-btn" onClick={onNext}>
          {isLast ? "Get Started" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingSlide;
