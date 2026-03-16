import { format } from "date-fns";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RangeCalendar } from "../components/range-calendar";

function dateLabel(date: Date) {
  return format(date, "PPPP");
}

describe("RangeCalendar", () => {
  it("creates a range from two clicks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<RangeCalendar month={new Date(2026, 2, 1)} onValueChange={onValueChange} />);

    await user.click(
      screen.getByRole("button", {
        name: dateLabel(new Date(2026, 2, 10))
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: dateLabel(new Date(2026, 2, 14))
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 2, 10),
      to: new Date(2026, 2, 14)
    });
  });

  it("normalizes reverse selections", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<RangeCalendar month={new Date(2026, 2, 1)} onValueChange={onValueChange} />);

    await user.click(
      screen.getByRole("button", {
        name: dateLabel(new Date(2026, 2, 20))
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: dateLabel(new Date(2026, 2, 12))
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 2, 12),
      to: new Date(2026, 2, 20)
    });
  });

  it("restarts range when disabled dates are inside interval", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RangeCalendar
        month={new Date(2026, 2, 1)}
        onValueChange={onValueChange}
        disabled={(date) => date.getDate() === 13}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: dateLabel(new Date(2026, 2, 10))
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: dateLabel(new Date(2026, 2, 16))
      })
    );

    expect(onValueChange).toHaveBeenLastCalledWith({
      from: new Date(2026, 2, 16),
      to: null
    });
  });
});
