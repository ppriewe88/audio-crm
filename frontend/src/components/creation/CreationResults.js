import { CARD_IDENTIFIERS } from "./CreationCards";
import { MakeOrderProductResults, MakeOrderResults } from "./makeOrder";
import { GetStorageLocationsResults } from "./getStorageLocations";
import { PayInvoiceResults } from "./payInvoice";
import { db_dict_de } from "../../dictionaries/database_dicts";

export const CreationResults = ({
  activeCard,
  infoFromAPI,
  stepCounterWizard,
  interimInfoFromAPI,
}) => {
  return (
    <div className="creation-results-container">
      {activeCard === CARD_IDENTIFIERS.inventory && (
        <GetStorageLocationsResults infoFromAPI={infoFromAPI} />
      )}
      {activeCard === CARD_IDENTIFIERS.order && (
        <>
          {[1.5, 2, 2.5, 3].includes(stepCounterWizard) && (
            <MakeOrderProductResults
              // interimInfoFromAPI={interimInfoFromAPI}
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
              // stepCounterWizard={stepCounterWizard}
            />
          )}
          {[3.5, 4].includes(stepCounterWizard) && (
            <MakeOrderResults
              // interimInfoFromAPI={interimInfoFromAPI}
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
              // stepCounterWizard={stepCounterWizard}
            />
          )}
        </>
      )}
      {activeCard === CARD_IDENTIFIERS.invoice && (
        <PayInvoiceResults
          interimInfoFromAPI={interimInfoFromAPI}
          infoFromAPI={infoFromAPI}
          dict={db_dict_de}
          stepCounterWizard={stepCounterWizard}
        />
      )}
    </div>
  );
};
