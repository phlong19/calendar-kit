import { format } from "date-fns";
import { axe } from "jest-axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Calendar } from "../components/calendar";

function dateLabel(date: Date) {
  return format(date, "PPPP");
}

describe("Calendar", () => {
  it("selects and clears a date in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const target = new Date(2026, 2, 16);
    const onValueChange = vi.fn();

    render(<Calendar month={new Date(2026, 2, 1)} onValueChange={onValueChange} />);

    const button = screen.getByRole("button", { name: dateLabel(target) });
    await user.click(button);
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 2, 16));

    await user.click(button);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("moves focus with arrow keys", async () => {
    const user = userEvent.setup();
    const date = new Date(2026, 2, 16);

    render(<Calendar month={new Date(2026, 2, 1)} defaultValue={date} />);

    const startButton = screen.getByRole("button", { name: dateLabel(date) });
    startButton.focus();

    await user.keyboard("{ArrowRight}");

    const nextButton = screen.getByRole("button", {
      name: dateLabel(new Date(2026, 2, 17))
    });
    expect(nextButton).toHaveFocus();
  });

  it("has no critical accessibility violations", async () => {
    const { container } = render(<Calendar month={new Date(2026, 2, 1)} />);
    const result = await axe(container);

    expect(result.violations).toHaveLength(0);
  });
});
