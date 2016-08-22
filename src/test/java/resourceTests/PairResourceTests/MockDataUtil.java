package resourceTests.PairResourceTests;


import domain.*;

import java.sql.Date;
import java.sql.Time;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.stream.Collectors;

public class MockDataUtil {

    public static Slots createSlot(SlotsTimes slotsTimes, Persons person, Date date, AvailabilityTypes availabilityType) {
        Slots slot = new Slots();
        slot.setType(availabilityType);
        slot.setSlot(slotsTimes);
        slot.setPerson(person);
        slot.setSlotsDate(date);
        person.getSlotsList().add(slot);
        return slot;
    }

    public static AvailabilityTypes createAvailableType(Long id, AvailabilityTypesEnum type) {
        AvailabilityTypes availabilityType = new AvailabilityTypes();
        availabilityType.setType(type);
        availabilityType.setId(id);
        return availabilityType;
    }

    public static SlotsTimes createSlotsTimes(Long id, LocalTime startTime, LocalTime endTime) {
        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setId(id);
        slotsTimes.setStartTime(Time.valueOf(startTime));
        slotsTimes.setEndTime(Time.valueOf(endTime));
        return slotsTimes;
    }

    public static Persons createPersons(Long id, String uniqueValue, Boolean isDev, Boolean isTest, Boolean isOps) {
        Persons person = new Persons();
        person.setId(id);
        person.setFirstName("NAME " + uniqueValue);
        person.setLastName("SURNAME " + uniqueValue);
        person.setEmail("EMAIL@EMAIL." + uniqueValue);
        person.setAdmin(false);
        person.setActive(true);
        person.setBandLevel(2);
        person.setIsDev(isDev);
        person.setIsTest(isTest);
        person.setIsWeb(isOps);
        return person;
    }

    public static Date createDate(int daysOffset) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, daysOffset);
        return new Date(calendar.getTimeInMillis());

    }

    public static String convertDateToString(Date date) {
        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        return dateFormat.format(date);
    }

    public static List<Slots> createSlotsToSlotTimes(List<SlotsTimes> slotsTimes, Persons person, Date date, AvailabilityTypes availabilityType) {

        List<Slots> slots = new ArrayList<>();
        for (SlotsTimes slotsTime : slotsTimes) {
            slots.add(MockDataUtil.createSlot(slotsTime, person, date, availabilityType));
        }

        return slots;
    }

    public static List<SlotsTimes> createSlotsTimesList(int startIndex, int endIndex) {
        List<SlotsTimes> slotsTimes = new ArrayList<>();
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 1   , LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 2   , LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 3   , LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 4   , LocalTime.of(9, 30, 0), LocalTime.of(10, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 5   , LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 6   , LocalTime.of(11, 0, 0), LocalTime.of(11, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 7   , LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 8   , LocalTime.of(12, 30, 0), LocalTime.of(13, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 9   , LocalTime.of(13, 0, 0), LocalTime.of(13, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 10  , LocalTime.of(13, 30, 0), LocalTime.of(14, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 11  , LocalTime.of(14, 0, 0), LocalTime.of(14, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 12  , LocalTime.of(14, 30, 0), LocalTime.of(15, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 13  , LocalTime.of(15, 0, 0), LocalTime.of(15, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 14  , LocalTime.of(15, 30, 0), LocalTime.of(16, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 15  , LocalTime.of(16, 0, 0), LocalTime.of(16, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 16  , LocalTime.of(16, 30, 0), LocalTime.of(17, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 17  , LocalTime.of(17, 0, 0), LocalTime.of(17, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotsTimes((long) 18  , LocalTime.of(17, 30, 0), LocalTime.of(18, 0, 0)));

        return slotsTimes
                .stream()
                .filter(slotTime -> slotTime.getId() >= startIndex && slotTime.getId() <= endIndex)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
