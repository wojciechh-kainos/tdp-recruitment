package daoTests;

import databaseHelper.BaseTest;
import domain.AvailabilityType;
import domain.AvailabilityTypeEnum;
import liquibase.exception.LiquibaseException;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class AvailabilityTypeDaoTest extends BaseTest{

    @Test
    public void getAvailabilityTypesTest() throws LiquibaseException {
        getSession().beginTransaction();

        AvailabilityType anotherAvailabilityType = availabilityTypeDao.getById(1);
        assertEquals("First returned availabilityType should be type available",
                AvailabilityTypeEnum.available, anotherAvailabilityType.getName());

        getSession().getTransaction().commit();
    }

}
