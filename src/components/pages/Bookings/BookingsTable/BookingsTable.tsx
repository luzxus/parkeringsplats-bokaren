import React, { useMemo, useState } from "react";
import { BookingData } from "../../../../models";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Button,
  useMediaQuery,
  List,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Grid,
  Typography,
} from "@mui/material";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { app, fireDb } from "../../../..";
import { getAuth } from "firebase/auth";
import { useTheme } from "@mui/material/styles";
import Delete from "@mui/icons-material/Delete";

interface BookingsTableProps {
  bookings: BookingData[];
}

interface TabPanelProps {
  value: number;
  index: number;
  data: BookingData[];
  deleteBooking?: (id: string) => void;
}
function TabPanel({ value, index, data, deleteBooking }: TabPanelProps) {
  const auth = getAuth();
  const currentUserEmail = auth.currentUser?.email ?? "";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {isMobile ? (
        <List>
          {data.map((bookingObj: BookingData) => (
            <ListItem key={bookingObj.booking_id}>
              <ListItemText
                primary={`From: ${bookingObj.start_date.toDateString()} To: ${bookingObj.end_date.toDateString()}`}
                secondary={`User: ${bookingObj.user_id.name} - Parking Spot ID: ${bookingObj.parking_spot_id.name}`}
              />
              {deleteBooking && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => deleteBooking(bookingObj.booking_id)}
                    disabled={bookingObj.user_id.email !== currentUserEmail}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Created</TableCell>
                <TableCell>User</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>Parking Spot ID</TableCell>
                {deleteBooking && <TableCell>Manage</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((bookingObj: BookingData) => (
                <TableRow key={bookingObj.booking_id}>
                  <TableCell>{bookingObj.createdDate}</TableCell>
                  <TableCell>{bookingObj.user_id.name}</TableCell>
                  <TableCell>{bookingObj.start_date.toDateString()}</TableCell>
                  <TableCell>{bookingObj.end_date.toDateString()}</TableCell>
                  <TableCell>{bookingObj.parking_spot_id.name}</TableCell>
                  {deleteBooking && (
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => deleteBooking(bookingObj.booking_id)}
                        disabled={bookingObj.user_id.email !== currentUserEmail}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
function BookingsTable({ bookings }: BookingsTableProps) {
  const filteredBookings = useMemo(() => {
    const currentDate = new Date();
    return bookings.filter((booking) => {
      const endDate = new Date(booking.end_date);
      return (
        currentDate >= endDate &&
        currentDate.toDateString() !== endDate.toDateString()
      );
    });
  }, [bookings]);

  const currentBookings = useMemo(() => {
    const currentDate = new Date();
    return bookings.filter((booking) => {
      const endDate = new Date(booking.end_date);
      return (
        currentDate < endDate ||
        currentDate.toDateString() === endDate.toDateString()
      );
    });
  }, [bookings]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  async function deleteBooking(bookingId: string) {
    const docRef: DocumentReference<DocumentData> = doc(
      fireDb,
      "Bookings",
      bookingId
    );
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Booking document does not exist");
      return;
    }

    await deleteDoc(docRef);

    console.log("Booking document deleted successfully");
  }

  const [value, setValue] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} m={2}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="div"
          gutterBottom
        >
          Bokningar
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Bookings"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile && "auto"}
            centered={!isMobile}
          >
            <Tab label="Aktuella Bokningar" />
            <Tab label="Utgångna Bokningar" />
          </Tabs>
        </Box>
        <TabPanel
          deleteBooking={deleteBooking}
          value={value}
          index={0}
          data={currentBookings}
        />
        <TabPanel value={value} index={1} data={filteredBookings} />
      </Grid>
    </Grid>
  );
}

export default React.memo(BookingsTable);
