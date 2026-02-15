// Интерфейс
// Любой самолёт должен реализовывать эти методы
function implementsAircraftInterface(obj) {
  return (
    typeof obj.getFuelConsumption === 'function' &&
    typeof obj.getRange === 'function'
  );
}

// Абстрактный базовый класс Aircraft
class Aircraft {
  #model;
  #range; // дальность полёта (км)
  #fuelConsumption; // расход топлива (л/100 км)

  constructor(model, range, fuelConsumption) {
    if (new.target === Aircraft) {
      throw new Error("Нельзя создавать экземпляры абстрактного класса Aircraft");
    }
    this.#model = model;
    this.#range = range;
    this.#fuelConsumption = fuelConsumption;
  }

  // Геттеры и сеттеры
  getModel() { return this.#model; }
  setModel(model) { this.#model = model; }

  getRange() { return this.#range; }
  setRange(range) { this.#range = range; }

  getFuelConsumption() { return this.#fuelConsumption; }
  setFuelConsumption(fuelConsumption) { this.#fuelConsumption = fuelConsumption; }

  // Обязательные методы
  getCapacity() {
    throw new Error("Метод getCapacity() должен быть реализован в подклассе");
  }

  getCargoCapacity() {
    throw new Error("Метод getCargoCapacity() должен быть реализован в подклассе");
  }

  toString() {
    return `${this.constructor.name} [Модель: ${this.#model}, Дальность: ${this.#range} км, Расход: ${this.#fuelConsumption} л/100 км]`;
  }

  equals(other) {
    return (
      other instanceof Aircraft &&
      this.#model === other.getModel() &&
      this.#range === other.getRange() &&
      this.#fuelConsumption === other.getFuelConsumption()
    );
  }
}

// Пассажирский самолёт
class PassengerAircraft extends Aircraft {
  #passengerCapacity;
  #cargoCapacity;

  constructor(model, range, fuelConsumption, passengerCapacity, cargoCapacity = 0) {
    super(model, range, fuelConsumption);
    this.#passengerCapacity = passengerCapacity;
    this.#cargoCapacity = cargoCapacity;

    if (!implementsAircraftInterface(this)) {
      throw new Error("PassengerAircraft не реализует интерфейс Aircraft");
    }
  }

  getCapacity() {
    return this.#passengerCapacity;
  }

  getCargoCapacity() {
    return this.#cargoCapacity;
  }

  toString() {
    return `${super.toString()}, Вместимость: ${this.#passengerCapacity} пассажиров, Груз: ${this.#cargoCapacity} т`;
  }

  equals(other) {
    return (
      super.equals(other) &&
      other instanceof PassengerAircraft &&
      this.#passengerCapacity === other.getCapacity() &&
      this.#cargoCapacity === other.getCargoCapacity()
    );
  }
}

// Грузовой самолёт
class CargoAircraft extends Aircraft {
  #cargoCapacity;

  constructor(model, range, fuelConsumption, cargoCapacity) {
    super(model, range, fuelConsumption);
    this.#cargoCapacity = cargoCapacity;

    if (!implementsAircraftInterface(this)) {
      throw new Error("CargoAircraft не реализует интерфейс Aircraft");
    }
  }

  getCapacity() {
    return 0; // пассажиров нет
  }

  getCargoCapacity() {
    return this.#cargoCapacity;
  }

  toString() {
    return `${super.toString()}, Грузоподъёмность: ${this.#cargoCapacity} т`;
  }

  equals(other) {
    return (
      super.equals(other) &&
      other instanceof CargoAircraft &&
      this.#cargoCapacity === other.getCargoCapacity()
    );
  }
}

// Класс Авиакомпания
class Airline {
  #name;
  #fleet;

  constructor(name) {
    this.#name = name;
    this.#fleet = [];
  }

  getName() { return this.#name; }
  setName(name) { this.#name = name; }

  addAircraft(aircraft) {
    if (!(aircraft instanceof Aircraft)) {
      throw new Error("Можно добавлять только объекты Aircraft или его подклассов");
    }
    this.#fleet.push(aircraft);
  }

  getTotalPassengerCapacity() {
    return this.#fleet.reduce((sum, aircraft) => sum + aircraft.getCapacity(), 0);
  }

  getTotalCargoCapacity() {
    return this.#fleet.reduce((sum, aircraft) => sum + aircraft.getCargoCapacity(), 0);
  }

  sortAircraftsByRange() {
    this.#fleet.sort((a, b) => a.getRange() - b.getRange());
  }

  findAircraftsByFuelConsumption(min, max) {
    return this.#fleet.filter(
      aircraft => aircraft.getFuelConsumption() >= min && aircraft.getFuelConsumption() <= max
    );
  }

  displayFleet() {
    console.log(`\n✈️  Флот авиакомпании "${this.#name}":`);
    if (this.#fleet.length === 0) {
      console.log("  Пусто.");
    } else {
      this.#fleet.forEach((aircraft, index) => {
        console.log(`  ${index + 1}. ${aircraft.toString()}`);
      });
    }
  }

  toString() {
    return `Авиакомпания: ${this.#name}, Самолётов: ${this.#fleet.length}`;
  }
}

// Основная программа
function main() {
  try {
    const airline = new Airline("SkyWings");

    // Создаём самолёты
    const boeing737 = new PassengerAircraft("Boeing 737", 5600, 2800, 189, 20);
    const airbusA350 = new PassengerAircraft("Airbus A350", 15000, 4500, 325, 40);
    const an124 = new CargoAircraft("Antonov An-124", 4500, 12000, 150);
    const cessna = new PassengerAircraft("Cessna 172", 1200, 200, 4, 0.3);

    // Добавляем в авиакомпанию
    airline.addAircraft(boeing737);
    airline.addAircraft(airbusA350);
    airline.addAircraft(an124);
    airline.addAircraft(cessna);

    // Вывод флота
    airline.displayFleet();

    // Общая вместимость и грузоподъёмность
    console.log(`\n📊 Общая пассажировместимость: ${airline.getTotalPassengerCapacity()} человек`);
    console.log(`📦 Общая грузоподъёмность: ${airline.getTotalCargoCapacity()} тонн`);

    // Сортировка по дальности
    airline.sortAircraftsByRange();
    console.log("\n🔄 После сортировки по дальности полёта:");
    airline.displayFleet();

    // Поиск по расходу топлива
    const fuelMin = 2000;
    const fuelMax = 5000;
    const found = airline.findAircraftsByFuelConsumption(fuelMin, fuelMax);
    console.log(`\n🔍 Самолёты с расходом топлива от ${fuelMin} до ${fuelMax} л/100 км:`);
    if (found.length > 0) {
      found.forEach(a => console.log(`  - ${a.toString()}`));
    } else {
      console.log("  Не найдено.");
    }

  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

main();