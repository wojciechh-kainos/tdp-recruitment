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
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    private final AvailabilityTypes typeAvailable = MockDataUtil.createAvailableType(1L, AvailabilityTypesEnum.available);
    private final AvailabilityTypes typeUnavailable = MockDataUtil.createAvailableType(4L, AvailabilityTypesEnum.unavailable);
    private final AvailabilityTypes typeMaybe = MockDataUtil.createAvailableType(5L, AvailabilityTypesEnum.maybe);
    private String startDate = MockDataUtil.convertDateToString(sameDate);
    private String endDate = MockDataUtil.convertDateToString(differentDate);

    private PairResource resource;
    private List<Slots> mockSlots = new ArrayList<>();
    private List<Persons> persons;

    @Mock
    private static SlotsDao mockDao;

    @Before
    public void setUp() {
        mockSlots.addAll(createFirstPerson());
        mockSlots.addAll(createSecondPerson());
        mockSlots.addAll(createThirdPerson());

        resource = new PairResource(mockDao);
        when(mockDao.findSlotsForPairMatching(startDate, endDate, isDev, isTest, isOps)).thenReturn(mockSlots);
        persons = resource.findPairs(startDate, endDate, isDev, isTest, isOps);
    }

    @Test
    public void testFindPairsWithDifferentTriplesShouldFindTwoPersons() {
        assertEquals("There should be only two persons found", 2, persons.size());
    }

    @Test
    public void testFindPairsWithDifferentTriplesShouldFindSecondAndThirdPerson() {
        List<Long> personIds = Arrays.asList(2L, 3L);

        assertTrue("There should be only person with id=2 and id=3",
                persons
                        .stream()
                        .map(Persons::getId)
                        .allMatch(personIds::contains));
    }

    @Test
    public void testFindPairsWithDifferentTriplesShouldFindSlotsTimesIdBetween9And13() {
        List<Long> slotsTimesIds = Arrays.asList(9L, 10L, 11L, 12L, 13L);

        assertTrue("There should be only SlotTimes with ids between 9 and 13",
                persons
                        .stream()
                        .map(person -> person.getSlotsList()
                                .stream()
                                .map(slot -> slot.getSlot().getId())
                                .allMatch(slotsTimesIds::contains))
                        .allMatch(isTrue -> isTrue));
    }

    private List<Slots> createFirstPerson() {
        List<SlotsTimes> slotsTimes = MockDataUtil.createSlotsTimesList(2, 11);
        Persons person = MockDataUtil.createPersons(1L, "First", isDev, isTest, isOps);

        return MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeUnavailable);
    }

    private List<Slots> createSecondPerson() {
        List<SlotsTimes> slotsTimes = MockDataUtil.createSlotsTimesList(1, 18);
        Persons person = MockDataUtil.createPersons(2L, "Second", isDev, isTest, isOps);

        List<Slots> slots = MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeAvailable);
        slots.get(1).setType(typeUnavailable);
        slots.get(2).setType(typeMaybe);
        slots.get(3).setType(typeMaybe);
        slots.get(4).setType(typeMaybe);
        slots.get(5).setType(typeMaybe);
        slots.get(6).setType(typeMaybe);
        slots.get(7).setType(typeUnavailable);
        slots.get(13).setType(typeUnavailable);
        slots.get(14).setType(typeUnavailable);
        slots.get(15).setType(typeUnavailable);
        slots.get(16).setType(typeMaybe);
        slots.get(17).setType(typeMaybe);

        return slots;
    }

    private List<Slots> createThirdPerson() {
        List<SlotsTimes> slotsTimes = MockDataUtil.createSlotsTimesList(7, 18);
        Persons person = MockDataUtil.createPersons(3L, "Third", isDev, isTest, isOps);

        List<Slots> slots = MockDataUtil.createSlotsToSlotTimes(slotsTimes, person, sameDate, typeAvailable);
        slots.get(7).setType(typeMaybe);
        slots.get(8).setType(typeMaybe);
        slots.get(9).setType(typeMaybe);
        slots.get(10).setType(typeMaybe);
        slots.get(11).setType(typeMaybe);

        return slots;
    }
}
