package resourceTests.PairResourceTests;

import dao.SlotDao;
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
    private List<Slot> mockSlots = new ArrayList<>();

    @Mock
    private static SlotDao mockDao;

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
        List<Person> pairs = resource.findPairs(startDate, endDate, isDev, isTest, isOps);

        assertEquals("There should be no pairs found", pairs.size(), 0);
    }

    private List<Slot> createFirstPerson(){
        List<SlotTime> slotsTimes = MockDataUtil.createSlotTimeList(1, 4);
        Person person = MockDataUtil.createPerson(1L, "First", isDev, isTest, isOps);
        AvailabilityType typeAvailable = MockDataUtil.createAvailableType(1L, AvailabilityTypeEnum.available);
        AvailabilityType typeFull = MockDataUtil.createAvailableType(1L, AvailabilityTypeEnum.available);
        List<Slot> slots = MockDataUtil.createSlotToSlotTime(slotsTimes, person, sameDate, typeAvailable);
        slots.get(1).setType(typeFull);

        return slots;
    }

    private List<Slot> createSecondPerson(){
        List<SlotTime> slotsTimes = MockDataUtil.createSlotTimeList(1, 4);
        Person person = MockDataUtil.createPerson(2L, "Second", isDev, isTest, isOps);
        AvailabilityType typeAvailable = MockDataUtil.createAvailableType(1L, AvailabilityTypeEnum.available);
        AvailabilityType typeFull = MockDataUtil.createAvailableType(1L, AvailabilityTypeEnum.available);

        return MockDataUtil.createSlotToSlotTime(slotsTimes, person, sameDate, typeAvailable);
    }

}
