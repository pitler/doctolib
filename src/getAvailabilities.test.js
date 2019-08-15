import knex from "knexClient";
import getAvailabilities from "./getAvailabilities";

describe("getAvailabilities", () => {
  beforeEach(() => knex("events").truncate());
  const days =7; 

  describe("case 1", () => {
    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"), days);
      expect(availabilities.length).toBe(days);
      for (let i = 0; i < days; ++i) {
        expect(availabilities[i].slots).toEqual([]);
      }
    });
  });

  describe("case 2", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 9:30"),
          ends_at: new Date("2014-08-11 10:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-10 09:30"),
          ends_at: new Date("2014-08-10 10:30"),
          weekly_recurring: true
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-10 11:30"),
          ends_at: new Date("2014-08-10 12:00"),
          weekly_recurring: true
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-10 14:00"),
          ends_at: new Date("2014-08-10 14:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"),days);
     // error.log("Tamaño :: "+ availabilities.length);
      expect(availabilities.length).toBe(days);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "14:00"
      ]);

      expect(String(availabilities[days-1].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("case 3", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        },
        {
          kind: "appointment",
          starts_at: new Date("2014-08-09 09:30"),
          ends_at: new Date("2014-08-09 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"), days);
      expect(availabilities.length).toBe(days);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[days-1].slots).toEqual([]);
    });
  });
});
