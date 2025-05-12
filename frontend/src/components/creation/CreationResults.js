import { CARD_IDENTIFIERS } from "./CreationCards";
import {
  MakeOrderProductResults,
  MakeOrderResults,
  MakeOrderCustomerResults,
} from "./makeOrder";
import {
  GetStorageLocationsResults,
  GetStorageLocationsProductResults,
} from "./getStorageLocations";
import { PayInvoiceResults, PayInvoiceCustomerResults } from "./payInvoice";
import { RevenuesResults } from "./revenues";
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
        <>
          {[2].includes(stepCounterWizard) && (
            <GetStorageLocationsProductResults
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
            />
          )}
          {[3].includes(stepCounterWizard) && (
            <GetStorageLocationsResults infoFromAPI={infoFromAPI} />
          )}
        </>
      )}
      {activeCard === CARD_IDENTIFIERS.order && (
        <>
          {[2].includes(stepCounterWizard) && (
            <MakeOrderCustomerResults
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
            />
          )}
          {[3, 4].includes(stepCounterWizard) && (
            <MakeOrderProductResults
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
            />
          )}
          {[5].includes(stepCounterWizard) && (
            <MakeOrderResults infoFromAPI={infoFromAPI} dict={db_dict_de} />
          )}
        </>
      )}
      {activeCard === CARD_IDENTIFIERS.invoice && (
        <>
          {[2].includes(stepCounterWizard) && (
            <PayInvoiceCustomerResults
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
              stepCounterWizard={stepCounterWizard}
            />
          )}
          {[3].includes(stepCounterWizard) && (
            <PayInvoiceResults
              infoFromAPI={infoFromAPI}
              dict={db_dict_de}
              stepCounterWizard={stepCounterWizard}
            />
          )}
        </>
      )}
      {activeCard === CARD_IDENTIFIERS.revenue && (
        <RevenuesResults infoFromAPI={infoFromAPI} dict={db_dict_de} />
      )}
    </div>
  );
};
