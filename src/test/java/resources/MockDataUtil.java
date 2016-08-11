package resources;


import domain.*;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalTime;

public class MockDataUtil {

    public static Slots createSlot(Long id, SlotsTimes slotsTimes, Persons person, Date date, AvailabilityTypes availabilityType){
        Slots slot = new Slots();
        slot.setId(id);
        slot.setType(availabilityType);
        slot.setSlot(slotsTimes);
        slot.setPerson(person);
        slot.setSlotsDate(date);
        person.getSlotsList().add(slot);
        return slot;
    }

    public static AvailabilityTypes createAvailableType(Long id, AvailabilityTypesEnum type){
        AvailabilityTypes availabilityType = new AvailabilityTypes();
        availabilityType.setType(type.toString());
        availabilityType.setId(id);
        return availabilityType;
    }

    public static SlotsTimes createSlotTime(Long id, LocalTime startTime, LocalTime endTime){
        SlotsTimes slotsTimes = new SlotsTimes();
        slotsTimes.setId(id);
        slotsTimes.setStartTime(Time.valueOf(startTime));
        slotsTimes.setEndTime(Time.valueOf(endTime));
        return slotsTimes;
    }

    public static Persons createPersons(Long id, String uniqueValue, Boolean isDev, Boolean isTest, Boolean isOps){
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
}
