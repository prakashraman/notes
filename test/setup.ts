import { stub, useFakeTimers } from "sinon";
import mock from "mock-fs";
import * as path from "path";

/** Stubs */
stub(console, "log");
stub(Date, "now").returns(new Date("2000").getTime());
useFakeTimers(new Date("2000"));

/**
 * Runs at the beginning of the test suite, before all the cases
 */
beforeEach(() => {
  mock({
    src: mock.load(path.resolve(__dirname, "../src")),
  });
});
