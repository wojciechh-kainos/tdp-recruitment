package domain;


import java.io.Serializable;
import java.util.List;

public class Pair implements Serializable {
    private Persons searchPerson;
    private Persons matchPerson;
    private List<Slots> searchSlots;
    private List<Slots> matchSlots;

    public Pair(){
    }

    public Pair(Persons searchPerson, Persons matchPerson, List<Slots> searchSlots, List<Slots> matchSlots) {
        this.searchPerson = searchPerson;
        this.matchPerson = matchPerson;
        this.searchSlots = searchSlots;
        this.matchSlots = matchSlots;
    }

    public Persons getSearchPerson() {
        return searchPerson;
    }

    public void setSearchPerson(Persons searchPerson) {
        this.searchPerson = searchPerson;
    }

    public Persons getMatchPerson() {
        return matchPerson;
    }

    public void setMatchPerson(Persons matchPerson) {
        this.matchPerson = matchPerson;
    }

    public List<Slots> getSearchSlots() {
        return searchSlots;
    }

    public void setSearchSlots(List<Slots> searchSlots) {
        this.searchSlots = searchSlots;
    }

    public List<Slots> getMatchSlots() {
        return matchSlots;
    }

    public void setMatchSlots(List<Slots> matchSlots) {
        this.matchSlots = matchSlots;
    }
}
