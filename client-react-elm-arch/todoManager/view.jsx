import React from "react";

const view = (listView, formView, summaryView) =>
  <div>
    {formView}
    {listView}
    {summaryView}
  </div>;

export { view };
