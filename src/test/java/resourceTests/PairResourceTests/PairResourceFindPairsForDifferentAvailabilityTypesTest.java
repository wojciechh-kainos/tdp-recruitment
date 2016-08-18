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
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)

public class PairResourceFindPairsForDifferentAvailabilityTypesTest {

    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private String startDate;
    private String endDate;

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp(){
        int TODAY_OFFSET = 0;
        Date date = MockDataUtil.createDate(TODAY_OFFSET);
        int TOMORROW_OFFSET = 1;
        Date nextDate = MockDataUtil.createDate(TOMORROW_OFFSET);
        startDate = MockDataUtil.convertDateToString(date);
        endDate = MockDataUtil.convertDateToString(nextDate);

        AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType((long) 1, AvailabilityTypesEnum.available);
        AvailabilityTypes typeMaybe = MockDataUtil.createAvailableType((long) 5, AvailabilityTypesEnum.maybe);
        List<SlotsTimes> expectedSameSlotsTimes = MockDataUtil.createSlotsTimesList(1,3);

        Persons firstPerson = MockDataUtil.createPersons((long)1, "FIRST", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, firstPerson, date, typeAvailable));
        Persons secondPerson = MockDataUtil.createPersons((long)2, "SECOND", isDev, isTest, isOps);
        mockSlots.addAll(MockDataUtil.createSlotsToSlotTimes(expectedSameSlotsTimes, secondPerson, date, typeMaybe));

        resource = new PairResource(mockDao);
    }

    @Test
    public void testFindPairForDifferentAvailabilityTypes(){
        when(mockDao.findBetweenPerJobProfile(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Persons> pairs  = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("One pair should be found", 2, pairs.size());

        Persons pair = pairs.get(0);
        assertEquals("Pair should have 3 elements", 3, pair.getSlotsList().size());
    }
}
