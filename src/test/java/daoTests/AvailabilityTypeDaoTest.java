package daoTests;

import databaseHelper.BaseTest;
import domain.AvailabilityType;
import domain.AvailabilityTypeEnum;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

@Ignore
public class AvailabilityTypeDaoTest extends BaseTest{

    @Test
    public void getAvailabilityTypesTest(){
        getSession().beginTransaction();

        AvailabilityType anotherAvailabilityType = availabilityTypeDao.getById(1);
        assertEquals("First returned availabilityType should be type available",
                AvailabilityTypeEnum.available, anotherAvailabilityType.getName());

        getSession().getTransaction().commit();
    }

}
