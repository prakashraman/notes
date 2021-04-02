import { stub } from "sinon";
import mock from "mock-fs";
import * as path from "path";

stub(console, "log");

beforeEach(() => {
  mock({
    src: mock.load(path.resolve(__dirname, "../src")),
  });
});
