package resourceTests.PairResourceTests;

import domain.Person;
import domain.Slot;
import domain.SlotTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;


@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsForWeekTest {

    private final Date sameDate = MockDataUtil.today;
    private final List<SlotTime> expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);
    private final List<SlotTime> threeDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(3, 5);
    private final List<SlotTime> twoDifferentSlotsTimes = MockDataUtil.createSlotsTimesList(4, 5);

    private List<Person> persons;

    @Before
    public void setUp() {
        List<Slot> mockSlots = new ArrayList<>();
        mockSlots.addAll(slotsForPerson(1L, twoDifferentSlotsTimes));
        mockSlots.addAll(slotsForPerson(2L, threeDifferentSlotsTimes));
        persons = MockDataUtil.findPairs(mockSlots);
    }

    @Test
    public void testFindPairForWeekShouldFindTwoPersons() {
        assertEquals("Should find 2 persons with pairs", 2, persons.size());
    }

    @Test
    public void testFindPairForWeekEachPersonShouldHaveThreeSlots() {
        assertTrue("Every person should have 3 slots in slotsList",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotList().size() == 3));
    }

    @Test
    public void testFindPairForWeekFoundSlotsShouldBeTheSameAsExpected() {
        Person firstPerson = persons.get(0);

        assertTrue("When two people has the same slots in different days only these with minimum 3 slots times should be shown",
                firstPerson
                        .getSlotList()
                        .stream()
                        .map(Slot::getSlotTime)
                        .allMatch(expectedSameSlotsTimes::contains));
    }

    @Test
    public void testFindPairForWeekFoundSlotsShouldBeAtExpectedDay() {
        Person firstPerson = persons.get(0);

        assertTrue("Found slots should be at expected day",
                firstPerson
                        .getSlotList()
                        .stream()
                        .allMatch(slot -> slot.getSlotDate().equals(sameDate)));
    }

    private List<Slot> slotsForPerson(Long personId, List<SlotTime> differentSlotTimes){
        List<Slot> slots = new ArrayList<>();
        Person person = MockDataUtil.createPerson(personId);
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, person, MockDataUtil.today, MockDataUtil.available));
        slots.addAll(MockDataUtil.createSlotsToSlotTimes(differentSlotTimes, person, MockDataUtil.tomorrow, MockDataUtil.available));

        return slots;
    }
}
