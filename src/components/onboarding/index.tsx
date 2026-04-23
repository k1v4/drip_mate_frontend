import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StyleStep, { StyleStepData } from "./context/stylestep";
import PersonalInfoStep, { PersonalInfoData } from "./personal_context";

// ── Types ──────────────────────────────────────────────────────────────────
interface OnboardingData {
  style?: StyleStepData;
  personal?: PersonalInfoData;
}

type OnboardingStep = 1 | 2;

const TOTAL_STEPS = 2;

// ── Component ──────────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>({});

  const handleStyleNext = (styleData: StyleStepData) => {
    setData((prev) => ({ ...prev, style: styleData }));
    setStep(2);
  };

  const handlePersonalNext = (personalData: PersonalInfoData) => {
    const finalData: OnboardingData = { ...data, personal: personalData };
    setData(finalData);

    // TODO: отправить finalData на сервер
    console.log("Onboarding complete:", finalData);

    navigate("/");
  };

  if (step === 1) {
    return (
      <StyleStep
        currentStep={1}
        totalSteps={TOTAL_STEPS}
        onBack={() => navigate(-1)}
        onNext={handleStyleNext}
      />
    );
  }

  return (
    <PersonalInfoStep
      currentStep={2}
      totalSteps={TOTAL_STEPS}
      onBack={() => setStep(1)}
      onNext={handlePersonalNext}
    />
  );
}
