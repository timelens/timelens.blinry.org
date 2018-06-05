IO.read("index.slim").scan(/youtube.com\/embed\/([^?]+?)\?/) do |match|
    vid = match[0]

    file = "videos/#{vid}.mp4"
    puts "Processing #{vid}..."

    if not File.exist?(file)
        puts "Video not found."
        print "Running youtube-dl... "
        system("youtube-dl -f 160 -o #{file} http://www.youtube.com/watch?v=#{vid}")
    end

    if not File.exist?("timelines/#{vid}.jpg") or not File.exist?("thumbnails/#{vid}.jpg")
        puts "Either timebar or thumbnail file not found."
        print "Running nordlicht... "
        system("~/wip/timelens/timelens/target/debug/timelens #{file} --timeline timelines/#{vid}.jpg --thumbnails thumbnails/#{vid}.jpg -w 1000 -h 90")
    end
end
