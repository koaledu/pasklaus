export type Value_Type = "null" | "number";

export interface Runtime_Val {
  type: Value_Type;
}

// Defines a value of undefined meaning
export interface Null_Val extends Runtime_Val {
  type: "null";
  value: "null";
}

// Runtime value that has access to the raw native javascript number.
export interface Number_Val extends Runtime_Val {
  type: "number";
  value: number;
}
