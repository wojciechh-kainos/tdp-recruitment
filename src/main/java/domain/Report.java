package domain;

/**
 * Created by radoslawl on 16/08/16.
 */
public class Report {

    private Persons person;
    private Long numberOfInitSlots;
    private Long numberOfFullSlots;
    private Long numberOfAvailableSlots;

    public Report(Persons person, Long numberOfInitSlots, Long numberOfAvailableSlots, Long numberOfFullSlots) {
        this.numberOfInitSlots = numberOfInitSlots;
        this.person = person;
        this.numberOfAvailableSlots = numberOfAvailableSlots;
        this.numberOfFullSlots = numberOfFullSlots;
    }

    public Long getNumberOfInitSlots() {
        return numberOfInitSlots;
    }

    public void setNumberOfInitSlots(Long numberOfInitSlots) {
        this.numberOfInitSlots = numberOfInitSlots;
    }

    public Persons getPerson() {
        return person;
    }

    public void setPerson(Persons person) {
        this.person = person;
    }

    public Long getNumberOfFullSlots() {
        return numberOfFullSlots;
    }

    public void setNumberOfFullSlots(Long numberOfFullSlots) {
        this.numberOfFullSlots = numberOfFullSlots;
    }

    public Long getNumberOfAvailableSlots() {
        return numberOfAvailableSlots;
    }

    public void setNumberOfAvailableSlots(Long numberOfAvailableSlots) {
        this.numberOfAvailableSlots = numberOfAvailableSlots;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Report report = (Report) o;

        if (person != null ? !person.equals(report.person) : report.person != null) return false;
        if (numberOfInitSlots != null ? !numberOfInitSlots.equals(report.numberOfInitSlots) : report.numberOfInitSlots != null)
            return false;
        if (numberOfFullSlots != null ? !numberOfFullSlots.equals(report.numberOfFullSlots) : report.numberOfFullSlots != null)
            return false;
        return numberOfAvailableSlots != null ? numberOfAvailableSlots.equals(report.numberOfAvailableSlots) : report.numberOfAvailableSlots == null;

    }

    @Override
    public int hashCode() {
        int result = person != null ? person.hashCode() : 0;
        result = 31 * result + (numberOfInitSlots != null ? numberOfInitSlots.hashCode() : 0);
        result = 31 * result + (numberOfFullSlots != null ? numberOfFullSlots.hashCode() : 0);
        result = 31 * result + (numberOfAvailableSlots != null ? numberOfAvailableSlots.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Report{" +
                "person=" + person +
                ", numberOfInitSlots=" + numberOfInitSlots +
                ", numberOfFullSlots=" + numberOfFullSlots +
                ", numberOfAvailableSlots=" + numberOfAvailableSlots +
                '}';
    }
}
