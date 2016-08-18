package domain;

/**
 * Created by radoslawl on 16/08/16.
 */
public class Report {

    private Persons person;
    private Long numberOfInitMinutes;
    private Long numberOfFullMinutes;
    private Long numberOfAvailableMinutes;

    public Report(Persons person, Long numberOfInitMinutes, Long numberOfAvailableMinutes, Long numberOfFullMinutes) {
        this.numberOfInitMinutes = numberOfInitMinutes;
        this.person = person;
        this.numberOfAvailableMinutes = numberOfAvailableMinutes;
        this.numberOfFullMinutes = numberOfFullMinutes;
    }

    public Long getNumberOfInitMinutes() {
        return numberOfInitMinutes;
    }

    public void setNumberOfInitMinutes(Long numberOfInitMinutes) {
        this.numberOfInitMinutes = numberOfInitMinutes;
    }

    public Persons getPerson() {
        return person;
    }

    public void setPerson(Persons person) {
        this.person = person;
    }

    public Long getNumberOfFullMinutes() {
        return numberOfFullMinutes;
    }

    public void setNumberOfFullMinutes(Long numberOfFullMinutes) {
        this.numberOfFullMinutes = numberOfFullMinutes;
    }

    public Long getNumberOfAvailableMinutes() {
        return numberOfAvailableMinutes;
    }

    public void setNumberOfAvailableMinutes(Long numberOfAvailableMinutes) {
        this.numberOfAvailableMinutes = numberOfAvailableMinutes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Report report = (Report) o;

        if (person != null ? !person.equals(report.person) : report.person != null) return false;
        if (numberOfInitMinutes != null ? !numberOfInitMinutes.equals(report.numberOfInitMinutes) : report.numberOfInitMinutes != null)
            return false;
        if (numberOfFullMinutes != null ? !numberOfFullMinutes.equals(report.numberOfFullMinutes) : report.numberOfFullMinutes != null)
            return false;
        return numberOfAvailableMinutes != null ? numberOfAvailableMinutes.equals(report.numberOfAvailableMinutes) : report.numberOfAvailableMinutes == null;

    }

    @Override
    public int hashCode() {
        int result = person != null ? person.hashCode() : 0;
        result = 31 * result + (numberOfInitMinutes != null ? numberOfInitMinutes.hashCode() : 0);
        result = 31 * result + (numberOfFullMinutes != null ? numberOfFullMinutes.hashCode() : 0);
        result = 31 * result + (numberOfAvailableMinutes != null ? numberOfAvailableMinutes.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Report{" +
                "person=" + person +
                ", numberOfInitMinutes=" + numberOfInitMinutes +
                ", numberOfFullMinutes=" + numberOfFullMinutes +
                ", numberOfAvailableMinutes=" + numberOfAvailableMinutes +
                '}';
    }
}
