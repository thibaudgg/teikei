import { List, Datagrid, TextField, ChipField } from "react-admin";
import Pagination from "../components/Pagination";

const TITLE = "Roles";

export const RolesList = (props) => (
  <List {...props} title={TITLE} pagination={<Pagination />} perPage={25}>
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" />
      <ChipField source="name" />
    </Datagrid>
  </List>
);
