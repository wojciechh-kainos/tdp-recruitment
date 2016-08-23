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

    public static Slot createSlot(SlotTime slotTime, Person person, Date date, AvailabilityType availabilityType) {
        Slot slot = new Slot();
        slot.setType(availabilityType);
        slot.setSlotTime(slotTime);
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
        SlotTime slotTime = new SlotTime();
        slotTime.setId(id);
        slotTime.setStartTime(Time.valueOf(startTime));
        slotTime.setEndTime(Time.valueOf(endTime));
        return slotTime;
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

    public static List<Slot> createSlotToSlotTime(List<SlotTime> slotTime, Person person, Date date, AvailabilityType availabilityType) {

        List<Slot> slots = new ArrayList<>();
        for (SlotTime slotsTime : slotTime) {
            slots.add(MockDataUtil.createSlot(slotsTime, person, date, availabilityType));
        }

        return slots;
    }

    public static List<SlotTime> createSlotTimeList(int startIndex, int endIndex) {
        List<SlotTime> slotTimes = new ArrayList<>();
        slotTimes.add(MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0)));
        slotTimes.add(MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0)));
        slotTimes.add(MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0)));
        slotTimes.add(MockDataUtil.createSlotTime((long) 4, LocalTime.of(9, 30, 0), LocalTime.of(10, 0, 0)));
        slotTimes.add(MockDataUtil.createSlotTime((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0)));

        return slotTimes
                .stream()
                .filter(slotTime -> slotTime.getId() >= startIndex && slotTime.getId() <= endIndex)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
