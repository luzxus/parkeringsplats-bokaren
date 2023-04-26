import React, { useState, useCallback, useRef, useEffect } from "react";

import { BookingData, BookingPostData, ParkingSpot } from "../../../../models";
import DateRangePicker from "../../../Datepicker/DateRangePicker";
import { Timestamp, addDoc, collection, doc } from "@firebase/firestore";
import { fireDb } from "../../../..";
import { getCurrentDate } from "../../../../various/utils";
import {
  getAllDocumentsFromCollection,
  getOverlappingBookings,
  getUserBookings,
} from "../../../../various/validation";
import { getAuth } from "@firebase/auth";
import "./BookingsForm.css";
import InfoIcon from "@mui/icons-material/Info";
import InfoPopup from "../../../Popup/InfoPopup";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Typography,
} from "@mui/material";
type Props = {
  userId: string;
  parkingSpots: ParkingSpot[];
};

type SnackProps = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const BookingForm: React.FC<Props> = ({ parkingSpots, userId }) => {
  const [parkingSpotId, setParkingSpotId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleParkingSpotChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setParkingSpotId(event.target.value);
      setFormErrors({});
    },
    []
  );
  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setFormErrors({});
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!parkingSpotId) {
        setFormErrors((errors) => ({
          ...errors,
          parkingSpot: "Please select a parking spot.",
        }));

        return;
      }

      if (!startDate || !endDate) {
        setFormErrors((errors) => ({
          ...errors,
          dateRange: "Please select a date range.",
        }));

        return;
      }
      const bookings: BookingData[] = await getAllDocumentsFromCollection(
        "Bookings"
      );
      const overlappingBookings = getOverlappingBookings(
        bookings,
        startDate,
        endDate,
        parkingSpotId
      );
      if (overlappingBookings.length > 0) {
        setFormErrors((errors) => ({
          ...errors,
          parkingSpot:
            "The selected parking spot is not available for the selected date range.",
        }));
        return;
      }

      const createDate = getCurrentDate();
      const currentDate = getTodayDate();
      const userBookings = getUserBookings(bookings, userId);

      // Check if the user has already made a booking today
      const todaysBookings = userBookings.filter((booking: BookingData) => {
        const bookingDate = new Date(booking.createdDate);
        return isSameDay(bookingDate, currentDate);
      });

      if (todaysBookings.length > 0) {
        setFormErrors((errors) => ({
          ...errors,
          dateRange:
            "Du har redan gjort en bokning idag. Du kan boka igen från och med 00:00",
        }));
        return;
      }

      const parkingSpotRef = doc(fireDb, `ParkingSpots/${parkingSpotId}`);
      const userRef = doc(fireDb, `Users/${userId}`);

      const newBookingData: BookingPostData = {
        end_date: endDate,
        parking_spot_id: parkingSpotRef,
        start_date: startDate,
        user_id: userRef,
        createdDate: createDate,
      };
      formErrors && setFormErrors({}); // reset form error

      await addBookingPost(newBookingData);
    },
    [parkingSpotId, startDate, endDate, userId, formErrors]
  );

  // Helper function to check if two dates are on the same day
  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // New function to get the current date as a Date object
  function getTodayDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  async function addBookingPost(bookingData: BookingPostData) {
    try {
      await addDoc(collection(fireDb, "Bookings"), bookingData);
      setToast({
        open: true,
        message: "Bokningen har nu skapats!",
        severity: "success",
      });
    } catch (error) {
      setToast({
        open: true,
        message: "Ett fel inträffade",
        severity: "error",
      });
    }
  }

  const [infoPopupOpen, setInfoPopupOpen] = useState(false);

  const openInfoPopup = () => {
    setInfoPopupOpen(true);
  };

  const closeInfoPopup = () => {
    setInfoPopupOpen(false);
  };

  const [suggestedDates, setSuggestedDates] = useState<Map<string, Date>>(
    new Map()
  );

  useEffect(() => {
    const findNextAvailableDates = async () => {
      const bookings: BookingData[] = await getAllDocumentsFromCollection(
        "Bookings"
      );
      const nextAvailableDates = new Map<string, Date>();

      for (const spot of parkingSpots) {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        while (true) {
          const overlappingBookings = getOverlappingBookings(
            bookings,
            currentDate,
            currentDate,
            spot.id
          );
          if (overlappingBookings.length === 0) {
            nextAvailableDates.set(spot.id, new Date(currentDate));
            break;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      setSuggestedDates(nextAvailableDates);
    };

    findNextAvailableDates();
  }, [parkingSpots]);

  const bookSuggestedHandler = async (parkingSpotId: string) => {
    if (!suggestedDates.get(parkingSpotId)) return;

    const suggestedStartDate = suggestedDates.get(parkingSpotId)!;
    const suggestedEndDate = new Date(suggestedStartDate);

    const parkingSpotRef = doc(fireDb, `ParkingSpots/${parkingSpotId}`);
    const userRef = doc(fireDb, `Users/${userId}`);

    const currentDate = getCurrentDate();
    const newBookingData: BookingPostData = {
      end_date: suggestedEndDate,
      parking_spot_id: parkingSpotRef,
      start_date: suggestedStartDate,
      user_id: userRef,
      createdDate: currentDate,
    };

    await addBookingPost(newBookingData);
  };
  const [selectOpen, setSelectOpen] = useState(false);
  const [toast, setToast] = useState<SnackProps>({
    open: false,
    message: "",
    severity: "success",
  });
  return (
    <div className="form-container">
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prevToast) => ({ ...prevToast, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            setToast((prevToast) => ({ ...prevToast, open: false }))
          }
          severity={toast.severity}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      {infoPopupOpen && <InfoPopup onClose={closeInfoPopup} />}
      <form onSubmit={handleSubmit}>
        <Box className="box-container" marginBottom={2}>
          <FormControl fullWidth>
            <InputLabel id="parking-spot-select-label" style={{ zIndex: 0 }}>
              Parkeringsplats
            </InputLabel>
            <Select
              labelId="parking-spot-select-label"
              id="parking-spot-select"
              value={parkingSpotId}
              onChange={handleParkingSpotChange}
              onOpen={() => setSelectOpen(true)}
              onClose={() => setSelectOpen(false)}
              required
            >
              <MenuItem value="">
                <em>Välj parkeringsplats</em>
              </MenuItem>
              {parkingSpots.map((spot) => (
                <MenuItem key={spot.id} className="menu-item" value={spot.id}>
                  {spot.name}
                  {selectOpen && (
                    <Button
                      onClick={() => bookSuggestedHandler(spot.id)}
                      variant="outlined"
                      size="small"
                      title="Tryck här om du vill boka det föreslagna datumet direkt"
                    >
                      Boka ({suggestedDates.get(spot.id)?.toLocaleDateString()})
                    </Button>
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InfoIcon
            cursor="pointer"
            color="info"
            onClick={openInfoPopup}
            sx={{ marginLeft: 1 }}
          />
        </Box>
        {formErrors.parkingSpot && (
          <p className="form-error">{formErrors.parkingSpot}</p>
        )}
        <Box className="box-container" marginBottom={2}>
          <Grid container flexDirection="column">
            <Typography variant="body2" color="Highlight">
              OBS! Just nu går det bara att boka{" "}
              <span style={{ fontWeight: "bold" }}>en gång</span> om dagen!
            </Typography>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onRangeChange={handleDateRangeChange}
            />
          </Grid>
        </Box>
        {formErrors.dateRange && (
          <p className="form-error">{formErrors.dateRange}</p>
        )}
        <Button type="submit" variant="contained" color="primary">
          Boka
        </Button>
      </form>
    </div>
  );
};
export default BookingForm;
