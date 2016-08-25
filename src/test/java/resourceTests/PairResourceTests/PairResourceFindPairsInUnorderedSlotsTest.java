package resourceTests.PairResourceTests;

import domain.Person;
import domain.Slot;
import domain.SlotTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static junit.framework.TestCase.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsInUnorderedSlotsTest {

    private final List<SlotTime> unorderedSlotTimes = createUnorderedSlotTimes();

    private List<Person> persons;

    @Before
    public void setUp() {
        List<Slot> mockSlots = new ArrayList<>();
        mockSlots.addAll(slotsForPerson(1L));
        mockSlots.addAll(slotsForPerson(2L));
        persons = MockDataUtil.findPairs(mockSlots);
    }

    @Test
    public void testFindPairForWeekInUnorderedSlotsShouldFindTwoPersons() {
        assertEquals("Two persons should be found", 2, persons.size());
    }

    @Test
    public void testFindPairForWeekInUnorderedSlotsShouldFindSixSlotsInFirstPerson() {
        Person firstPerson = persons.get(0);
        assertEquals("First person should have 6 slots in slotsList", 6, firstPerson.getSlotList().size());

    }

    private List<Slot> slotsForPerson(Long personId){
        Person person = MockDataUtil.createPerson(personId);

        return MockDataUtil.createSlotsToSlotTimes(unorderedSlotTimes, person, MockDataUtil.today, MockDataUtil.available);
    }

    private List<SlotTime> createUnorderedSlotTimes() {
        SlotTime sameSlotTimesFirst = MockDataUtil.createSlotTime((long) 2, LocalTime.of(8, 30, 0), LocalTime.of(9, 0, 0));
        SlotTime sameSlotTimesSecond = MockDataUtil.createSlotTime((long) 1, LocalTime.of(8, 0, 0), LocalTime.of(8, 30, 0));
        SlotTime sameSlotTimesThird = MockDataUtil.createSlotTime((long) 5, LocalTime.of(10, 0, 0), LocalTime.of(10, 30, 0));
        SlotTime sameSlotTimesFourth = MockDataUtil.createSlotTime((long) 3, LocalTime.of(9, 0, 0), LocalTime.of(9, 30, 0));
        SlotTime sameSlotTimesFifth = MockDataUtil.createSlotTime((long) 9, LocalTime.of(12, 0, 0), LocalTime.of(12, 30, 0));
        SlotTime sameSlotTimesSixth = MockDataUtil.createSlotTime((long) 7, LocalTime.of(11, 0, 0), LocalTime.of(11, 30, 0));
        SlotTime sameSlotTimesSeventh = MockDataUtil.createSlotTime((long) 8, LocalTime.of(11, 30, 0), LocalTime.of(12, 0, 0));

        return Arrays.asList(sameSlotTimesFirst, sameSlotTimesSecond, sameSlotTimesThird, sameSlotTimesFourth, sameSlotTimesFifth, sameSlotTimesSixth, sameSlotTimesSeventh);
    }
}
