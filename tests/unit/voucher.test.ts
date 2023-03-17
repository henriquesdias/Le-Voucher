import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

import { jest } from "@jest/globals";

function createVoucher(used: boolean) {
  return {
    id: 0,
    code: "AAA",
    discount: 40,
    used,
  };
}

describe("Creation of voucher", () => {
  it("Should return a error when voucher already exists", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => createVoucher(false));
    const voucher = createVoucher(false);
    const result = voucherService.createVoucher(voucher.code, voucher.discount);

    expect(result).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict",
    });
  });

  it("Should create a new voucher and return undefined", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => undefined);
    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => undefined);

    const result = await voucherService.createVoucher("AAA", 65);

    expect(result).toBe(undefined);
  });
});

describe("Apply voucher", () => {
  it("Should return a error when voucher don't exists", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => undefined);

    const voucher = createVoucher(false);
    const result = voucherService.applyVoucher(voucher.code, 250);

    expect(result).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict",
    });
  });
});
