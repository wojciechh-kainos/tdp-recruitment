package resourceTests.PairResourceTests;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)

public class PairResourceFindPairsForDifferentAvailabilityTypesTest {

    private List<Slots> mockSlots = new ArrayList<>();
    private List<Persons> persons;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {
        final Boolean isTest = false;
        String startDate;
        String endDate;
        int TODAY_OFFSET = 0;
        Date date = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date nextDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(date);
        endDate = MockDataUtil.convertDateToString(nextDate);

        AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        AvailabilityTypes typeMaybe = MockDataUtil.createAvailableType((long) 5, AvailabilityTypesEnum.maybe);
        List<SlotsTimes> expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1, 3);

        Boolean isDev = true;
        Boolean isOps = false;
        Persons firstPerson = MockDataUtil.createPersons((long) 1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, firstPerson, date, typeAvailable));
        Persons secondPerson = MockDataUtil.createPersons((long) 2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, secondPerson, date, typeMaybe));

        PairResource resource = new PairResource(mockDao);

        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, isDev, isTest, isOps);
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
                        .allMatch(person -> person.getSlotsList().size() == 3));
    }
}
