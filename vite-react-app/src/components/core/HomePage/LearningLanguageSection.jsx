import React from "react";
import HighlightText from "./HighlightText";
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_others from "../../../assets/Images/Compare_with_others.png";
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "./Button";

const LearningLanguageSection = () => {
  return (
    <section className="mt-[130px] mb-10 md:mb-28 px-4">
      <div className="flex flex-col gap-5 items-center">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-center font-inter">
          Your Swiss Knife for
          <HighlightText text="learning any language" />
        </h1>

        {/* Subtext */}
        <p className="text-center text-richblack-600 mx-auto text-base font-medium max-w-[700px] font-inter">
          Using Spin makes learning multiple languages easy. With 20+ languages,
          realistic voice-over, progress tracking, custom schedules, and more.
        </p>

        {/* Image row */}
        <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-6 mt-6 min-h-[200px]">
          <img
            src={know_your_progress}
            alt="Know your progress"
            loading="lazy"
            width={250}
            height={200}
            className="object-contain"
          />
          <img
            src={compare_with_others}
            alt="Compare with others"
            loading="lazy"
            width={250}
            height={200}
            className="object-contain"
          />
          <img
            src={plan_your_lessons}
            alt="Plan your lessons"
            loading="lazy"
            width={250}
            height={200}
            className="object-contain"
          />
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <CTAButton active={true} linkto="/signup">
            <span>Learn More</span>
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default LearningLanguageSection;
