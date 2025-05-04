import { CARD_IDENTIFIERS } from "./CreationCards";
import { MakeOrderResults } from "./makeOrder";
import { GetStorageLocationsResults } from "./getStorageLocations";
import { PayInvoiceResults } from "./payInvoice";
import { db_dict_de } from "../../dictionaries/database_dicts";

export const CreationResults = ({ activeCard, infoFromAPI }) => {
  return (
    <div className="creation-results-container">
      {activeCard === CARD_IDENTIFIERS.order && (
        <MakeOrderResults infoFromAPI={infoFromAPI} dict={db_dict_de} />
      )}
      {activeCard === CARD_IDENTIFIERS.inventory && (
        <GetStorageLocationsResults infoFromAPI={infoFromAPI} />
      )}
      {activeCard === CARD_IDENTIFIERS.invoice && (
        <PayInvoiceResults infoFromAPI={infoFromAPI} dict={db_dict_de} />
      )}
    </div>
  );
};
