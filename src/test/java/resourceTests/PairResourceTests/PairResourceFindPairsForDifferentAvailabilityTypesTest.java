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
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsForDifferentAvailabilityTypesTest {
    private final List<SlotTime> expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);

    private List<Slot> mockSlots = new ArrayList<>();
    private List<Person> persons;

    @Before
    public void setUp() {
        mockSlots.addAll(slotsForPerson(1L, MockDataUtil.available));
        mockSlots.addAll(slotsForPerson(2L, MockDataUtil.maybe));

        persons = MockDataUtil.findPairs(mockSlots);
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypesShouldFindTwoPersons() {
        assertEquals("Two persons should be found", 2, persons.size());
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypesShouldFindThreeSlots() {
        assertTrue("First person should have 3 slots",
                persons
                        .stream()
                        .allMatch(person -> person.getSlotList().size() == 3));
    }

    private List<Slot> slotsForPerson(Long personId, AvailabilityType availabilityType){
        Person person = MockDataUtil.createPerson(personId);

        return MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, person, MockDataUtil.today, availabilityType);
    }
}
