import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { Step, StepProps } from "./Step";
import styles from "./Steps.module.scss";

type StepsProps = {
  className?: string;
  steps: StepProps[];
  current?: string;
  showInactiveContent?: boolean;
};

export const Steps: FC<StepsProps> = ({
  className,
  steps,
  current,
  showInactiveContent = false,
}) => {
  const [currentStep, setCurrentStep] = useState(steps[0].id);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentStep(
      current || steps.find((step) => step.isActive)?.id || steps[0].id
    );
  }, [current, steps]);

  const currentIdx = steps.findIndex((step) => step.id === currentStep);

  if (!isClient) {
    return <div className={clsx(styles.container, className)}></div>;
  }

  return (
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {steps.map((step, idx) => {
          const isPassed = Number(idx) < currentIdx;
          const isActive = step.isActive || currentIdx === Number(idx);

          return (
            <li
              className={clsx(
                styles.item,
                isPassed ? styles.passed : null,
                isActive ? styles.active : null,
              )}
              key={idx}
            >
              <Step
                {...step}
                content={
                  showInactiveContent || isActive ? step.content : undefined
                }
                className={clsx(styles.step)}
                isActive={isActive}
                isPassed={isPassed}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
