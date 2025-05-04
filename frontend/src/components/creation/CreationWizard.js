import { CARD_IDENTIFIERS } from "./CreationCards";
import { MakeOrderWizard } from "./makeOrder";
import { GetStorageLocationsWizard } from "./getStorageLocations";
import { PayInvoiceWizard } from "./payInvoice";

export const CreationWizard = ({
  activeCard,
  sendingButtonActive,
  speechInput,
  stepCounterWizard,
  cumulativeWizardInput,
}) => {
  return (
    <div className="creation-control-container">
      {activeCard === CARD_IDENTIFIERS.order && (
        <MakeOrderWizard
          sendingButtonActive={sendingButtonActive}
          stepCounterWizard={stepCounterWizard}
          speechInput={speechInput}
          cumulativeWizardInput={cumulativeWizardInput}
        />
      )}
      {activeCard === CARD_IDENTIFIERS.inventory && (
        <GetStorageLocationsWizard
          sendingButtonActive={sendingButtonActive}
          speechInput={speechInput}
        />
      )}
      {activeCard === CARD_IDENTIFIERS.invoice && (
        <PayInvoiceWizard
          sendingButtonActive={sendingButtonActive}
          stepCounterWizard={stepCounterWizard}
          speechInput={speechInput}
          cumulativeWizardInput={cumulativeWizardInput}
        />
      )}
      {activeCard === null && "Wizard"}
    </div>
  );
};
