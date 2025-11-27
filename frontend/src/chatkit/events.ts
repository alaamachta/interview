export const ESCALATION_SUCCESS_EVENT = "interview:escalation-success";

export const dispatchEscalationSuccessEvent = (
  detail = {}
) => {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent(ESCALATION_SUCCESS_EVENT, {
      detail,
    })
  );
};
