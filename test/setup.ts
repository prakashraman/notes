import { stub, useFakeTimers } from "sinon";
import mock from "mock-fs";
import * as path from "path";

stub(console, "log");
stub(Date, "now").returns(new Date("2000").getTime());
useFakeTimers(new Date("2000"));

beforeEach(() => {
  mock({
    src: mock.load(path.resolve(__dirname, "../src")),
  });
});
