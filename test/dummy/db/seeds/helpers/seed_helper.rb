class ApplicationRecord
  after_create :output_dot

  def output_dot
    print "."
  end
end

def seed_file(path)
  file = File.join(Rails.root, "db", "seeds", "files", path)
  mime_type = Rack::Mime.mime_type(file)
  Rack::Test::UploadedFile.new(file, mime_type)
end

def seed_random_file(path)
  file = Dir.glob("#{Rails.root}/db/seeds/files/#{path}/*").sample
  mime_type = Rack::Mime.mime_type(file)
  Rack::Test::UploadedFile.new(file, mime_type)
end

def seed_random_files(path, count:)
  files = []
  count.times.each do |index|
    files << seed_random_file(path)
  end
  files
end

def title(value)
  print("\n#{value}")
end

def separator
  print("|")
end

def random_resource(model, reject: nil)
  resources = model
  resources = resources.where("id <> ?", reject.id) if reject
  resources.order("RAND()").first
end
