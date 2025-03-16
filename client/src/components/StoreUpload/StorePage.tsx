import Grid from "@mui/material/Grid";
import { StoreInformationSection } from "../../components/StoreUpload/StoreInformationSection";
import { AddWorker } from "./AddWorker";
import { AddImage } from "./AddImage";

export const Store = () => {
  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} sm={7}>
          <StoreInformationSection />
          <AddWorker />
        </Grid>

        <Grid item xs={12} sm={5}>
          <AddImage />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "center" }}
      ></Grid>
    </Grid>
  );
};
