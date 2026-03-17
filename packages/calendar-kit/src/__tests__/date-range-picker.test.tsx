import { format, startOfDay } from "date-fns";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DateRangePicker } from "../components/date-range-picker";

function dateLabel(date: Date) {
  return format(date, "PPPP");
}

describe("DateRangePicker", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not commit on first click when autoApply=true", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    render(<DateRangePicker autoApply onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: dateLabel(fromDate) }));

    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: dateLabel(toDate) }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: fromDate,
      to: toDate
    });
  });

  it("does not commit draft changes until Apply when autoApply=false", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    render(<DateRangePicker autoApply={false} onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: dateLabel(fromDate) }));
    await user.click(screen.getByRole("button", { name: dateLabel(toDate) }));

    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: fromDate,
      to: toDate
    });
  });

  it("clear commits null", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    render(
      <DateRangePicker
        autoApply={false}
        onValueChange={onValueChange}
        defaultValue={{ from: fromDate, to: toDate }}
      />
    );

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("keeps calendars consecutive when changing right month dropdown", async () => {
    const user = userEvent.setup();

    render(<DateRangePicker autoApply={false} />);

    await user.click(screen.getByPlaceholderText("Select date range"));

    await user.click(screen.getByLabelText("Next month Calendar 2"));
    await user.click(screen.getByLabelText("Next month Calendar 2"));

    expect(screen.getByLabelText("Month Calendar 1")).toHaveTextContent("May");
    expect(screen.getByLabelText("Month Calendar 2")).toHaveTextContent("June");
  });

  it("commits preset immediately when autoApply=true", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const today = startOfDay(new Date());

    render(<DateRangePicker autoApply onValueChange={onValueChange} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: "Today" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith({
      from: today,
      to: today
    });
  });

  it("hydrates custom presets from localStorage", async () => {
    const user = userEvent.setup();
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const toDate = new Date(now.getFullYear(), now.getMonth(), 14);

    const { unmount } = render(<DateRangePicker autoApply={false} />);

    await user.click(screen.getByPlaceholderText("Select date range"));
    await user.click(screen.getByRole("button", { name: dateLabel(fromDate) }));
    await user.click(screen.getByRole("button", { name: dateLabel(toDate) }));
    await user.type(screen.getByPlaceholderText("Custom range"), "Sprint");
    await user.click(screen.getByRole("button", { name: "Save" }));

    unmount();

    render(<DateRangePicker autoApply={false} />);

    await user.click(screen.getByPlaceholderText("Select date range"));

    expect(screen.getByRole("button", { name: "Sprint" })).toBeInTheDocument();
  });

  it("supports localized built-in preset labels", async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        autoApply
        presetLabels={{
          today: "Hôm nay",
          yesterday: "Hôm qua"
        }}
      />
    );

    await user.click(screen.getByPlaceholderText("Select date range"));

    expect(screen.getByRole("button", { name: "Hôm nay" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hôm qua" })).toBeInTheDocument();
  });
});
