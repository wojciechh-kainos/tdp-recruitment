package resourceTests.PairResourceTests;

import dao.SlotDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;
import services.PairFinder;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceTest {

    private final List<SlotTime> expectedSlotTimes = MockDataUtil.createSlotsTimesList(1, 3);
    private final List<SlotTime> differentSlotsTime = MockDataUtil.createSlotsTimesList(5, 5);
    private final Date sameDate = MockDataUtil.today;
    private final Date differentDate = MockDataUtil.tomorrow;
    private final AvailabilityType typeAvailable = MockDataUtil.available;

    private List<Person> persons;

    @Before
    public void setUp() {
        List<Slot> mockSlots = new ArrayList<>();

        mockSlots.addAll(slotsForFirstPerson());
        mockSlots.addAll(slotsForSecondPerson());
        persons = MockDataUtil.findPairs(mockSlots);
    }

    @Test
    public void testFindPairsShouldFindTwoPersons() {
        assertEquals("Should find 2 persons with persons", 2, persons.size());
    }

    @Test
    public void testFindPairsEveryPersonShouldHaveThreeSlots() {
        assertTrue("First person should have 3 slots in slotsList",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotList().size() == 3));
    }

    @Test
    public void testFindPairsEveryPairShouldHaveSlotsTimesAsExpected() {
        assertTrue("SlotsTimes of all paired persons should be equal to expectedSlotTimes",
                persons
                        .stream()
                        .allMatch(person -> person
                                .getSlotList()
                                .stream()
                                .map(Slot::getSlotTime)
                                .allMatch(expectedSlotTimes::contains))
        );
    }

    private List<Slot> slotsForFirstPerson(){
        List<Slot> slots = new ArrayList<>();
        Person person = MockDataUtil.createPerson(1L);
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSlotTimes, person, sameDate, typeAvailable));
        slots.add(MockDataUtil.createSlot(expectedSlotTimes.get(0), person, differentDate, typeAvailable));

        return slots;
    }

    private List<Slot> slotsForSecondPerson(){
        List<Slot> slots = new ArrayList<>();
        Person person = MockDataUtil.createPerson(2L);
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSlotTimes, person, sameDate, typeAvailable));
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(differentSlotsTime, person, sameDate, typeAvailable));

        return slots;
    }
}
