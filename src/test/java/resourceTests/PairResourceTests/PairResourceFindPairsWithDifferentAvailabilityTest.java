package resourceTests.PairResourceTests;

import dao.SlotsDao;
import domain.*;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PairResource;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PairResourceFindPairsWithDifferentAvailabilityTest {

    private final int TODAY_OFFSET = 0;
    private final int TOMORROW_OFFSET = 1;
    private final Boolean isDev = true;
    private final Boolean isTest = false;
    private final Boolean isOps = false;
    private final Date sameDate = MockDataUtil.createDate(TODAY_OFFSET);
    private final Date differentDate = MockDataUtil.createDate(TOMORROW_OFFSET);
    private String startDate = MockDataUtil.convertDateToString(sameDate);
    private String endDate = MockDataUtil.convertDateToString(differentDate);

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {
        mockSlots.addAll(createFirstPerson());
        mockSlots.addAll(createSecondPerson());

        resource = new PairResource(mockDao);
    }

    @Test
    @Ignore
    public void testFindPairsShouldFindNoPairs() {
        when(mockDao.findSlotsForPairMatching(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        List<Persons> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("There should be no pairs found", pairs.size(), 0);
    }

    private List<Slots> createFirstPerson(){
        List<SlotsTimes> slotsTimes = MockDataUtil.createSlotsTimesList(1, 4);
        Persons person = MockDataUtil.createPersons(1L, "First", isDev, isTest, isOps);
        AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType(1L, AvailabilityTypesEnum.available);
        AvailabilityTypes typeFull = MockDataUtil.createAvailableType(1L, AvailabilityTypesEnum.available);
        List<Slots> slots = MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeAvailable);
        slots.get(1).setType(typeFull);

        return slots;
    }

    private List<Slots> createSecondPerson(){
        List<SlotsTimes> slotsTimes = MockDataUtil.createSlotsTimesList(1, 4);
        Persons person = MockDataUtil.createPersons(2L, "Second", isDev, isTest, isOps);
        AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType(1L, AvailabilityTypesEnum.available);
        AvailabilityTypes typeFull = MockDataUtil.createAvailableType(1L, AvailabilityTypesEnum.available);

        return MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeAvailable);
    }

}
