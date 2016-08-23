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

    public static Slot createSlot(SlotTime slotsTimes, Person person, Date date, AvailabilityType availabilityType) {
        Slot slot = new Slot();
        slot.setType(availabilityType);
        slot.setSlotTime(slotsTimes);
        slot.setPerson(person);
        slot.setSlotDate(date);
        person.getSlotList().add(slot);
        return slot;
    }

    public static AvailabilityType createAvailableType(Long id, AvailabilityTypeEnum type) {
        AvailabilityType availabilityType = new AvailabilityType();
        availabilityType.setName(type);
        availabilityType.setId(id);

        return availabilityType;
    }

    public static SlotTime createSlotTime(Long id, LocalTime startTime, LocalTime endTime) {
        SlotTime slotsTimes = new SlotTime();
        slotsTimes.setId(id);
        slotsTimes.setStartTime(Time.valueOf(startTime));
        slotsTimes.setEndTime(Time.valueOf(endTime));

        return slotsTimes;
    }

    public static Person createPerson(Long id, String uniqueValue, Boolean isDev, Boolean isTest, Boolean isOps, Boolean isOther) {
        Person person = new Person();
        person.setId(id);
        person.setFirstName("NAME " + uniqueValue);
        person.setLastName("SURNAME " + uniqueValue);
        person.setEmail("EMAIL@EMAIL." + uniqueValue);
        person.setAdmin(false);
        person.setActive(true);
        person.setBandLevel(2);
        person.setIsDev(isDev);
        person.setIsTest(isTest);
        person.setIsOps(isOps);
        person.setIsOther(isOther);
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

    public static List<Slot> createSlotsToSlotTimes(List<SlotTime> slotsTimes, Person person, Date date, AvailabilityType availabilityType) {

        List<Slot> slots = new ArrayList<>();
        for (SlotTime slotsTime : slotsTimes) {
            slots.add(MockDataUtil.createSlot(slotsTime, person, date, availabilityType));
        }

        return slots;
    }

    public static List<SlotTime> createSlotsTimesList(int startIndex, int endIndex) {
        List<SlotTime> slotsTimes = new ArrayList<>();
        slotsTimes.add(MockDataUtil.createSlotTime((long) 1   , LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 2   , LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 3   , LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 4   , LocalTime.of(9, 30, 0), LocalTime.of(10, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 5   , LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 6   , LocalTime.of(11, 0, 0), LocalTime.of(11, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 7   , LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 8   , LocalTime.of(12, 30, 0), LocalTime.of(13, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 9   , LocalTime.of(13, 0, 0), LocalTime.of(13, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 10  , LocalTime.of(13, 30, 0), LocalTime.of(14, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 11  , LocalTime.of(14, 0, 0), LocalTime.of(14, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 12  , LocalTime.of(14, 30, 0), LocalTime.of(15, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 13  , LocalTime.of(15, 0, 0), LocalTime.of(15, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 14  , LocalTime.of(15, 30, 0), LocalTime.of(16, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 15  , LocalTime.of(16, 0, 0), LocalTime.of(16, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 16  , LocalTime.of(16, 30, 0), LocalTime.of(17, 0, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 17  , LocalTime.of(17, 0, 0), LocalTime.of(17, 30, 0)));
        slotsTimes.add(MockDataUtil.createSlotTime((long) 18  , LocalTime.of(17, 30, 0), LocalTime.of(18, 0, 0)));

        return slotsTimes
                .stream()
                .filter(slotTime -> slotTime.getId() >= startIndex && slotTime.getId() <= endIndex)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
