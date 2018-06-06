def timelens vid, file
    if not File.exist?("timelines/#{vid}.jpg") or not File.exist?("thumbnails/#{vid}.jpg") or not File.exist?("thumbnails/#{vid}.vtt")
        puts "One of the required files not found."
        print "Running timelens... "
        system("timelens #{file} --timeline timelines/#{vid}.jpg --thumbnails thumbnails/#{vid}.jpg --vtt thumbnails/#{vid}.vtt -w 1000 -h 90 --seek")
    end
end

puts "Processing nemo..."
timelens("nemo", "'/home/seb/library/movies/Finding Nemo/re up finding nemo.avi'")

IO.read("index.slim").scan(/youtube.com\/embed\/([^?]+?)\?/) do |match|
    vid = match[0]

    file = "videos/#{vid}.mp4"
    puts "Processing #{vid}..."

    if not File.exist?(file)
        puts "Video not found."
        print "Running youtube-dl... "
        system("youtube-dl -f 160 -o #{file} http://www.youtube.com/watch?v=#{vid}")
    end

    timelens(vid, file)
end
