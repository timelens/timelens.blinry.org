def timelens vid, file
    timeline_file = "content/timelines/#{vid}.jpg"
    vtt_file = "content/thumbnails/#{vid}.vtt"
    if not File.exist?(timeline_file) or not File.exist?(vtt_file)
        puts "One of the required files not found."
        print "Running timelens... "
        system("timelens #{file} -w 1000 -h 90 --timeline #{timeline_file} --thumbnails #{vtt_file}")
    end
end

puts "Processing nemo..."
timelens("nemo", "'/home/seb/library/movies/Finding Nemo/re up finding nemo.avi'")

IO.read("content/index.slim").scan(/youtube.com\/embed\/([^"]+?)"/) do |match|
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
