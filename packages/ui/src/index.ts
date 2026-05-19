export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const OPEN_CIVIC_KIT_STATUS = "planned";
