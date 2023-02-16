require_relative "app/models/view_model"
require "ostruct"
require "benchmark"

COUNT = 1_000_000
NAME = "Test Name"
EMAIL = "test@example.org"

class Person
  attr_accessor :name, :email
end

class PersonView < ViewModel
end

PersonStruct = Struct.new(:name, :email)

Benchmark.bm(13) do |x|
  x.report("class") do
    COUNT.times do
      p = Person.new
      p.name = NAME
      p.email = EMAIL
    end
  end

  x.report("view_model") do
    COUNT.times do
      PersonView.new(name: NAME, email: EMAIL)
    end
  end

  x.report("hash") do
    COUNT.times do
      {name: NAME, email: EMAIL}
    end
  end

  x.report("struct") do
    COUNT.times do
      p = PersonStruct.new
      p.name = NAME
      p.email = EMAIL
    end
  end

  x.report("openstruct") do
    COUNT.times do
      p = OpenStruct.new
      p.name = NAME
      p.email = EMAIL
    end
  end
end

# Date: 17/02/2022:
# Setup: 2,6 GHz 6-core Intel Core i7, 32GB 2400 MHz DDR4
#
# user     system      total        real
# class          0.169072   0.000539   0.169611 (  0.169697)
# view_model     0.929992   0.006090   0.936082 (  0.941641)
# hash           0.119616   0.001091   0.120707 (  0.120952)
# struct         0.214027   0.000405   0.214432 (  0.214613)
# openstruct    17.307242   0.033848  17.341090 ( 17.347235)

# Date: 24/02/2022:
# Setup: Apple M1 Pro, 32GB LPDDR5
#
# user     system      total        real
# class           0.096301   0.001296   0.097597 (  0.097740)
# view_model      0.437532   0.003827   0.441359 (  0.441495)
# hash            0.058507   0.000627   0.059134 (  0.059147)
# struct          0.113017   0.001193   0.114210 (  0.114293)
# openstruct      6.233697   0.057665   6.291362 (  6.291534)
