import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

import { jest } from "@jest/globals";

function createVoucher(used: boolean) {
  return {
    id: Math.floor(Math.random() * 10 + 1),
    code: "AAA",
    discount: Math.floor(Math.random() * 80 + 1),
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
    const voucher = createVoucher(false);
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => undefined);
    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => undefined);

    const result = await voucherService.createVoucher(
      voucher.code,
      voucher.discount
    );

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

  it("Should do not apply a discount to a already use voucher", async () => {
    const voucher = createVoucher(true);

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          ...voucher,
        };
      });
    const amount = 300;
    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result).toEqual({
      amount,
      discount: voucher.discount,
      finalAmount: amount,
      applied: false,
    });
  });

  it("Should apply a discount to a voucher", async () => {
    const voucher = createVoucher(false);

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          ...voucher,
        };
      });
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {
        Promise;
      });

    const amount = 300;
    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result).toEqual({
      amount,
      discount: voucher.discount,
      finalAmount: amount - (amount * voucher.discount) / 100,
      applied: true,
    });
  });
});
